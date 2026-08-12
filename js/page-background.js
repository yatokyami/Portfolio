/* Reuse the landing page's CoreRenderer project so secondary pages receive
   the identical interactive hero background rather than a static image. */
(function () {
  const targets = document.querySelectorAll('.about-bg, .contact-bg, .work-bg');
  if (!targets.length || !window.CoreRenderer || !window._heroProjectData) return;

  // The project was authored from the site root. Secondary pages live one
  // directory deeper, so make its asset URL resolve from their location.
  const project = JSON.parse(JSON.stringify(window._heroProjectData));
  const assetPrefix = location.pathname.includes('/info/') || location.pathname.includes('/contact/') || location.pathname.includes('/works/') ? '../' : '';
  (function fixAssetPaths(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.src === 'string' && value.src.indexOf('assets/') === 0) {
      value.src = assetPrefix + value.src;
    }
    Object.values(value).forEach(fixAssetPaths);
  })(project);

  const projectUrl = URL.createObjectURL(new Blob([JSON.stringify(project)], { type: 'application/json' }));
  targets.forEach((target) => target.setAttribute('data-cr-project-src', projectUrl));

  window.CoreRenderer.init()
    .catch((error) => console.error('Secondary-page hero background could not start:', error))
    .finally(() => URL.revokeObjectURL(projectUrl));
}());
