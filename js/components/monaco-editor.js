let loaderPromise = null;

function loadMonacoLoader() {
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${window.MONACO_CDN_BASE}/vs/loader.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Monaco loader script'));
    document.body.appendChild(script);
  }).catch(err => {
    loaderPromise = null;
    throw err;
  });

  return loaderPromise;
}

export async function mountMonacoEditor(container, { value = '', language = 'c' } = {}) {
  await loadMonacoLoader();

  return new Promise((resolve, reject) => {
    window.require.config({ paths: { vs: `${window.MONACO_CDN_BASE}/vs` } });
    window.require(
      ['vs/editor/editor.main'],
      () => {
        const editor = window.monaco.editor.create(container, {
          value,
          language,
          automaticLayout: true,
        });
        resolve(editor);
      },
      () => reject(new Error('Failed to load Monaco editor.main'))
    );
  });
}
