import { mountMonacoEditor } from './monaco-editor.js';

export async function mountPracticeBox(container, { starterCode = '' } = {}) {
  container.innerHTML = `
    <div class="card practice-box">
      <div class="practice-box-editor"></div>
      <button class="practice-box-check" type="button">Check</button>
      <div class="practice-output"></div>
    </div>
  `;

  const editorContainer = container.querySelector('.practice-box-editor');
  const editor = await mountMonacoEditor(editorContainer, { value: starterCode, language: 'c' });

  const checkButton = container.querySelector('.practice-box-check');
  checkButton.addEventListener('click', () => {
    console.log('[practice-box] check clicked:', editor.getValue());
  });

  return editor;
}
