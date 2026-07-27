const VARIANTS = {
  info: { icon: 'ℹ️', color: '--color-primary', bg: 'rgba(37, 99, 235, 0.08)' },
  warning: { icon: '⚠️', color: '--color-warning', bg: 'rgba(245, 158, 11, 0.1)' },
  success: { icon: '✅', color: '--color-success', bg: 'rgba(34, 197, 94, 0.1)' },
  danger: { icon: '🚫', color: '--color-danger', bg: 'rgba(239, 68, 68, 0.1)' },
};

export function renderAlertBox({ variant, message }) {
  const config = VARIANTS[variant] || VARIANTS.info;

  return `
    <div class="alert-box" style="border-left-color: var(${config.color}); background: ${config.bg};">
      ${config.icon} ${message}
    </div>
  `;
}
