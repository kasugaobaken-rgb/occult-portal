/* 境界記録ポータル：ARG調査メモ連携 v1
   最上フォーム側 localStorage keys:
   - mogami_arg_visited_sites: ["occult", ...]
   - mogami_arg_evidence: [{id,title,source,description}, ...]
*/
(function(){
  'use strict';
  const EVIDENCE_KEY = 'mogami_arg_evidence';
  const VISITED_KEY = 'mogami_arg_visited_sites';
  const MOGAMI_URL = 'https://kasugaobaken-rgb.github.io/musical-octo-lamp/';

  const EVIDENCE = {
    occult_site_found: {
      id: 'occult_site_found',
      title: 'オカルトポータルサイトを確認',
      source: '境界記録ポータル',
      description: 'オカルト、神隠し、異界、記録媒体に関する総合ポータルを確認した。'
    },
    kamikakushi_types: {
      id: 'kamikakushi_types',
      title: '神隠しには複数の型がある',
      source: '境界記録ポータル / 神隠し・異界の謎',
      description: '神隠しは「人だけが消える」「痕跡が薄れる」「記憶まで曖昧になる」など複数の型に分けられるという整理。'
    },
    tengu_return: {
      id: 'tengu_return',
      title: '天狗に攫われた者が戻る話',
      source: '境界記録ポータル / 神隠し・異界の謎',
      description: '天狗攫いでは、失踪者が戻った後に奇妙な知識や時間感覚のズレを語る場合がある。'
    },
    trace_disappear: {
      id: 'trace_disappear',
      title: '痕跡や記憶ごと消える神隠し型',
      source: '境界記録ポータル / 神隠し・異界の謎',
      description: '本人だけでなく、持ち物、写真、周囲の記憶まで薄れる型があるという考察。'
    },
    cassette_ritual_sounds: {
      id: 'cassette_ritual_sounds',
      title: 'カセット音声：水・縄・鈴・太鼓',
      source: '境界記録ポータル / 録音異常・心霊写真',
      description: 'カセットの冒頭に、水音、縄を引く音、鈴、太鼓に似た連続音があるという調査メモ。'
    },
    ritual_document_web: {
      id: 'ritual_document_web',
      title: '東北地方文献：境界越えの儀式',
      source: '境界記録ポータル / 異界入りと境界越えの儀式',
      description: '東北地方で見つかった文献断片に、境界を越えるための儀式らしき記述がある。'
    },
    ritual_pear_shoes: {
      id: 'ritual_pear_shoes',
      title: '境界越え：梨の木と履き物を脱ぐ記述',
      source: '境界記録ポータル / 異界入りと境界越えの儀式',
      description: '境界を越える際、梨の木の前で履き物を脱ぐという断片的な記述。'
    },
    tsukishima_rumor: {
      id: 'tsukishima_rumor',
      title: 'ツキシマという人物の噂',
      source: '境界記録ポータル / ツキシマという都市伝説',
      description: '80〜90年代の都内オカルト好きの間で、怪しい情報を教える人物として噂されたツキシマの記録。'
    },
    tsukishima_bars: {
      id: 'tsukishima_bars',
      title: 'ツキシマは新宿近辺のバーに出没した',
      source: '境界記録ポータル / ツキシマという都市伝説',
      description: 'ツキシマは新宿近辺のバーに出入りしていたという目撃談が複数ある。'
    },
    tsukishima_ikai: {
      id: 'tsukishima_ikai',
      title: 'ツキシマは別世界への行き方を知っていた',
      source: '境界記録ポータル / ツキシマという都市伝説',
      description: 'ツキシマは神隠しを異界への移動として扱い、別世界への行き方を知っていたという噂。'
    }
  };

  function readList(key){
    try { const raw = localStorage.getItem(key); return raw ? (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : []) : []; }
    catch(e){ return []; }
  }
  function writeList(key, value){ try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){} }
  function recordVisitedSite(siteId){
    const id = String(siteId || '').trim();
    if (!id) return;
    const list = readList(VISITED_KEY).map(String);
    if (!list.includes(id)) { list.push(id); writeList(VISITED_KEY, list); }
  }
  function hasEvidence(id){ return readList(EVIDENCE_KEY).some(item => item && item.id === id); }
  function saveMogamiEvidence(id){
    const ev = EVIDENCE[id];
    if (!ev) { showToast('この調査メモは登録されていません。'); return false; }
    recordVisitedSite('occult');
    const list = readList(EVIDENCE_KEY);
    const idx = list.findIndex(item => item && item.id === ev.id);
    if (idx >= 0) list[idx] = Object.assign({}, list[idx], ev);
    else list.push(ev);
    writeList(EVIDENCE_KEY, list);
    markSavedButtons(ev.id);
    showToast('調査メモに保存しました。最上との通信で添付できます。');
    return true;
  }
  function markSavedButtons(id){
    document.querySelectorAll('[data-arg-evidence="' + id + '"]').forEach(btn => {
      btn.classList.add('saved'); btn.textContent = '調査メモに保存済み';
    });
  }
  function showToast(text){
    let toast = document.querySelector('.arg-toast');
    if(!toast){ toast = document.createElement('div'); toast.className = 'arg-toast'; document.body.appendChild(toast); }
    toast.textContent = text; toast.classList.add('show');
    clearTimeout(showToast._timer); showToast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function addFloatingBack(){
    if(document.querySelector('.arg-back-link')) return;
    const a = document.createElement('a'); a.className = 'arg-back-link'; a.href = MOGAMI_URL; a.textContent = '最上との通信に戻る'; document.body.appendChild(a);
  }
  function init(){
    recordVisitedSite('occult');
    addFloatingBack();
    Object.keys(EVIDENCE).forEach(id => { if (hasEvidence(id)) markSavedButtons(id); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.recordVisitedSite = recordVisitedSite;
  window.saveMogamiEvidence = saveMogamiEvidence;
  window.saveOccultEvidence = saveMogamiEvidence;
})();
