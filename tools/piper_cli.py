import argparse
import json
import sys
import tempfile
import wave

from piper.voice import PiperVoice
from piper.config import SynthesisConfig


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--output")
    parser.add_argument("--text")
    parser.add_argument("--length-scale", type=float, default=1.1)
    parser.add_argument("--server", action="store_true")
    args = parser.parse_args()
    if args.server:
        voice = PiperVoice.load(args.model)
        for line in sys.stdin:
            try:
                request = json.loads(line)
                output = request['output']
                with wave.open(output, 'wb') as wav_file:
                    voice.synthesize_wav(str(request.get('text', '')), wav_file, SynthesisConfig(length_scale=1.1))
                print(json.dumps({'id': request.get('id'), 'ok': True}), flush=True)
            except Exception as error:
                print(json.dumps({'id': request.get('id'), 'ok': False, 'error': str(error)}), flush=True)
        return 0
    if not args.output:
        parser.error('--output is required outside server mode')
    text = args.text if args.text is not None else sys.stdin.read()
    text = text.strip()
    if not text:
        return 0
    voice = PiperVoice.load(args.model)
    with wave.open(args.output, "wb") as wav_file:
        voice.synthesize_wav(text, wav_file, SynthesisConfig(length_scale=max(0.7, args.length_scale)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
