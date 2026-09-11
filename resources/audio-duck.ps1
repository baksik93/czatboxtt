param(
  [Parameter(Mandatory = $true)][ValidateSet('Duck', 'Restore')][string]$Mode,
  [Parameter(Mandatory = $true)][string]$StatePath
)
$ErrorActionPreference = 'Stop'

if (-not ('CzatboxAudio.SessionVolume' -as [type])) {
  Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace CzatboxAudio {
  enum EDataFlow { eRender, eCapture, eAll }
  enum ERole { eConsole, eMultimedia, eCommunications }
  [Flags] enum CLSCTX : uint { ALL = 23 }

  [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
  class MMDeviceEnumerator {}

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("A95664D2-9614-4F35-A746-DE8DB63617E6")]
  interface IMMDeviceEnumerator {
    int EnumAudioEndpoints(EDataFlow flow, uint stateMask, out object devices);
    int GetDefaultAudioEndpoint(EDataFlow flow, ERole role, out IMMDevice device);
  }

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("D666063F-1587-4E43-81F1-B948E807363F")]
  interface IMMDevice {
    int Activate(ref Guid iid, CLSCTX context, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object instance);
  }

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F")]
  interface IAudioSessionManager2 {
    int GetAudioSessionControl(IntPtr sessionGuid, uint flags, out IntPtr control);
    int GetSimpleAudioVolume(IntPtr sessionGuid, uint flags, out IntPtr volume);
    int GetSessionEnumerator(out IAudioSessionEnumerator enumerator);
  }

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8")]
  interface IAudioSessionEnumerator {
    int GetCount(out int count);
    int GetSession(int index, out IAudioSessionControl control);
  }

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("F4B1A599-7266-4319-A8CA-E70ACB11E8CD")]
  interface IAudioSessionControl {
    int GetState(out int state); int GetDisplayName(out IntPtr name); int SetDisplayName(string value, ref Guid context);
    int GetIconPath(out IntPtr path); int SetIconPath(string value, ref Guid context); int GetGroupingParam(out Guid grouping);
    int SetGroupingParam(ref Guid grouping, ref Guid context); int RegisterAudioSessionNotification(IntPtr client); int UnregisterAudioSessionNotification(IntPtr client);
  }

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("bfb7ff88-7239-4fc9-8fa2-07c950be9c6d")]
  interface IAudioSessionControl2 {
    int GetState(out int state); int GetDisplayName(out IntPtr name); int SetDisplayName(string value, ref Guid context);
    int GetIconPath(out IntPtr path); int SetIconPath(string value, ref Guid context); int GetGroupingParam(out Guid grouping);
    int SetGroupingParam(ref Guid grouping, ref Guid context); int RegisterAudioSessionNotification(IntPtr client); int UnregisterAudioSessionNotification(IntPtr client);
    int GetSessionIdentifier(out IntPtr id); int GetSessionInstanceIdentifier(out IntPtr id); int GetProcessId(out uint pid);
  }

  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("87CE5498-68D6-44E5-9215-6DA47EF883D8")]
  interface ISimpleAudioVolume {
    int SetMasterVolume(float level, ref Guid context); int GetMasterVolume(out float level);
    int SetMute(bool mute, ref Guid context); int GetMute(out bool mute);
  }

  public class Entry { public uint Pid; public float Volume; }

  public static class SessionVolume {
    static List<Tuple<uint, ISimpleAudioVolume>> Sessions() {
      var result = new List<Tuple<uint, ISimpleAudioVolume>>();
      var enumerator = (IMMDeviceEnumerator)new MMDeviceEnumerator();
      IMMDevice device; Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out device));
      Guid iid = typeof(IAudioSessionManager2).GUID; object raw;
      Marshal.ThrowExceptionForHR(device.Activate(ref iid, CLSCTX.ALL, IntPtr.Zero, out raw));
      IAudioSessionEnumerator sessions; Marshal.ThrowExceptionForHR(((IAudioSessionManager2)raw).GetSessionEnumerator(out sessions));
      int count; Marshal.ThrowExceptionForHR(sessions.GetCount(out count));
      for (int i = 0; i < count; i++) {
        IAudioSessionControl control; if (sessions.GetSession(i, out control) != 0) continue;
        var control2 = control as IAudioSessionControl2; var volume = control as ISimpleAudioVolume;
        if (control2 == null || volume == null) continue;
        uint pid; if (control2.GetProcessId(out pid) == 0) result.Add(Tuple.Create(pid, volume));
      }
      return result;
    }
    static bool IsCzatbox(uint pid) {
      if (pid == 0) return false;
      try { return Process.GetProcessById((int)pid).ProcessName.StartsWith("Czatbox TT", StringComparison.OrdinalIgnoreCase); }
      catch { return false; }
    }
    public static Entry[] Duck(float factor) {
      var saved = new List<Entry>(); Guid context = Guid.Empty;
      foreach (var session in Sessions()) {
        if (IsCzatbox(session.Item1)) continue;
        float volume; if (session.Item2.GetMasterVolume(out volume) != 0) continue;
        saved.Add(new Entry { Pid = session.Item1, Volume = volume });
        session.Item2.SetMasterVolume(Math.Max(0f, Math.Min(1f, volume * factor)), ref context);
      }
      return saved.ToArray();
    }
    public static void Restore(Entry[] saved) {
      if (saved == null) return; Guid context = Guid.Empty;
      var queues = new Dictionary<uint, Queue<float>>();
      foreach (var item in saved) { if (!queues.ContainsKey(item.Pid)) queues[item.Pid] = new Queue<float>(); queues[item.Pid].Enqueue(item.Volume); }
      foreach (var session in Sessions()) if (queues.ContainsKey(session.Item1) && queues[session.Item1].Count > 0) session.Item2.SetMasterVolume(queues[session.Item1].Dequeue(), ref context);
    }
  }
}
'@
}

if ($Mode -eq 'Duck') {
  [CzatboxAudio.SessionVolume]::Duck(0.30) | ConvertTo-Json -Compress | Set-Content -LiteralPath $StatePath -Encoding UTF8
} elseif (Test-Path -LiteralPath $StatePath) {
  $saved = Get-Content -LiteralPath $StatePath -Raw | ConvertFrom-Json
  $entries = New-Object 'System.Collections.Generic.List[CzatboxAudio.Entry]'
  foreach ($item in $saved) {
    $entry = [CzatboxAudio.Entry]::new()
    $entry.Pid = [uint32]$item.Pid
    $entry.Volume = [single]$item.Volume
    $entries.Add($entry)
  }
  [CzatboxAudio.SessionVolume]::Restore($entries.ToArray())
  Remove-Item -LiteralPath $StatePath -Force
}
