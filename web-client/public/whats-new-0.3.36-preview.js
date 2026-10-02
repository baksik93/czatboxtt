(() => {
  'use strict';

  const panel = document.querySelector('#aboutWhatsNew');
  const article = panel?.querySelector('.whats-new-article');
  if (!panel || !article) return;

  const aboutDescription = document.querySelector('#aboutProgram .about-description > p');
  if (aboutDescription) {
    aboutDescription.textContent = aboutDescription.textContent.replace('wersji 0.3.35', 'wersji 0.3.36');
  }

  const support = article.querySelector('.is-support');
  const release035Article = article.cloneNode(true);
  release035Article.querySelector('.is-support')?.remove();
  article.innerHTML = `
    <div class="whats-new-hero">
      <div class="whats-new-hero-glow" aria-hidden="true"></div>
      <img src="/whats-new-app-icon-v1.png" alt="Czatbox TT">
      <div>
        <span>AKTUALIZACJA 0.3.36</span>
        <h3>Jedno konto.<br>Pewniejszy LIVE.</h3>
        <p>Konto w przeglądarce, spokojniejsze dźwięki, stabilne alerty ról i własny kanał aktualizacji.</p>
      </div>
    </div>
    <p class="whats-new-lead">Wersja 0.3.36 porządkuje zarządzanie kontem i dźwiękami, przywraca przewidywalne alerty ważnych widzów oraz przenosi kolejne aktualizacje na serwery Czatbox TT.</p>
    <section class="whats-new-section is-new">
      <h3><span>Co nowego</span></h3>
      <div class="whats-new-entry">
        <h4><span aria-hidden="true">✦</span> Konto zarządzane w przeglądarce</h4>
        <p>Po wybraniu „Konto” aplikacja otwiera stronę Czatbox TT. Po zalogowaniu awatar i nick są widoczne w prawym górnym rogu, a ich naciśnięcie otwiera edycję profilu.</p>
      </div>
      <div class="whats-new-entry">
        <h4><span aria-hidden="true">✦</span> Aktualizacje z serwerów Czatbox TT</h4>
        <p>0.3.36 jest ostatnią wersją publikowaną również na GitHubie. Po jej instalacji program sprawdza kolejne aktualizacje bezpośrednio na serwerze Czatbox TT.</p>
      </div>
    </section>
    <section class="whats-new-section is-improved">
      <h3><span>Co poprawiliśmy</span></h3>
      <div class="whats-new-entry">
        <h4><span aria-hidden="true">✦</span> Spokojniejsza Krita</h4>
        <p>Wiadomości Krity nie odtwarzają już natarczywego dźwięku. Ten sygnał pozostaje jako czytelne potwierdzenie połączenia z twórcą.</p>
      </div>
      <div class="whats-new-entry">
        <h4><span aria-hidden="true">✦</span> Pewne alerty ważnych widzów</h4>
        <p>Wejścia moderatora, superfana i Strażnika są wykrywane deterministycznie, bez pomijania zdarzeń i losowych powtórzeń.</p>
      </div>
      <div class="whats-new-entry">
        <h4><span aria-hidden="true">✦</span> Test prezentu zapisuje wybrany dźwięk</h4>
        <p>Przycisk odtwarzania najpierw zapisuje aktualny wybór w pamięci aplikacji, a następnie odtwarza dokładnie ten sam dźwięk.</p>
      </div>
    </section>
    <section class="whats-new-section is-technical">
      <h3><span>Co pod maską</span></h3>
      <p class="whats-new-intro">Migracja zachowuje dotychczasowe ustawienia użytkownika:</p>
      <ul class="whats-new-tech">
        <li>Użytkownicy 0.3.35 otrzymają 0.3.36 przez dotychczasowy kanał GitHub.</li>
        <li>Od 0.3.36 aplikacja sprawdza nowe wersje na updates.czatboxtt.com.</li>
        <li>Instalator ze strony i automatyczne aktualizacje korzystają z tego samego zestawu plików wydania.</li>
      </ul>
    </section>`;

  if (support) article.append(support);
  const date = panel.querySelector('.whats-new-header time');
  const title = panel.querySelector('#whatsNewTitle');
  if (title) title.textContent = 'Co nowego';
  if (date) {
    date.dateTime = '2026-10-02';
    date.textContent = '2 października 2026';
  }

  const updateHistory = document.querySelector('#settings-data');
  const versionList = updateHistory?.querySelector('.update-history-versions');
  const detail = updateHistory?.querySelector('.update-history-release-content');
  const historyDate = updateHistory?.querySelector('#updateHistoryDate');
  if (versionList && detail && historyDate) {
    const legacyReleases = [...versionList.querySelectorAll('button')].map(button => {
      button.click();
      return {
        version: button.querySelector('b')?.textContent || '',
        date: button.querySelector('small')?.textContent || '',
        article: detail.querySelector('.whats-new-article')?.cloneNode(true)
      };
    }).filter(release => release.version && release.article);
    const release036Article = article.cloneNode(true);
    release036Article.querySelector('.is-support')?.remove();
    const releases = [
      { version: '0.3.36', date: '2 października 2026', article: release036Article },
      { version: '0.3.35', date: '30 września 2026', article: release035Article },
      ...legacyReleases.filter(release => release.version !== '0.3.35')
    ];
    const showRelease = index => {
      const release = releases[index] || releases[0];
      [...versionList.querySelectorAll('button')].forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      historyDate.textContent = release.date;
      detail.replaceChildren(release.article.cloneNode(true));
      detail.scrollTop = 0;
      window.dispatchEvent(new CustomEvent('cttm-i18n-refresh'));
    };
    versionList.replaceChildren();
    releases.forEach((release, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.role = 'tab';
      button.innerHTML = `<b>${release.version}</b><small>${release.date}</small>`;
      button.onclick = () => showRelease(index);
      versionList.append(button);
    });
    showRelease(0);
  }

  if (new URLSearchParams(location.search).get('localPreview') === '1') {
    window.CzatboxI18n?.apply?.('pl');
    const backdrop = panel.closest('.whats-new-backdrop');
    if (backdrop) backdrop.style.zIndex = '1200';
    document.querySelector('#whatsNewLauncher')?.click();
  }
})();
