/* ════════════════════════════════════════════════════════════════
   A.U.R.A 공통 인증 가드 (auth.js)
   사용법: 보호하려는 모든 HTML <head> 최상단에
          <script src="auth.js"></script> 삽입
   ════════════════════════════════════════════════════════════════ */
(function() {
  var SESSION_KEY = 'aura_session';
  var raw = sessionStorage.getItem(SESSION_KEY);
  var ok = false;

  if (raw) {
    try {
      var s = JSON.parse(raw);
      // 토큰 존재 + 만료 미경과 시 통과
      if (s && s.token && s.expires && Date.now() < s.expires) {
        ok = true;
      }
    } catch(e) {}
  }

  if (!ok) {
    sessionStorage.removeItem(SESSION_KEY);
    // 페이지 렌더링 자체를 차단하기 위해 즉시 redirect
    window.location.replace('login.html');
  }

  // 전역에서 로그아웃 호출 가능
  window.AURA_logout = function() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace('login.html');
  };

  // 세션 만료 자동 감시 (1분마다)
  setInterval(function() {
    var raw2 = sessionStorage.getItem(SESSION_KEY);
    if (!raw2) { window.AURA_logout(); return; }
    try {
      var s2 = JSON.parse(raw2);
      if (Date.now() >= s2.expires) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.AURA_logout();
      }
    } catch(e) { window.AURA_logout(); }
  }, 60 * 1000);
})();
