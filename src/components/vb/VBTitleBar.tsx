import type { HTMLAttributes } from 'react';

export type TitleBarPointerHandlers = Pick<HTMLAttributes<HTMLElement>,
  'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel' | 'onLostPointerCapture'>;

type VBTitleBarProps = {
  title: string;
  onClose?: () => void;
  pointerHandlers?: TitleBarPointerHandlers;
};

export function VBTitleBar({ title, onClose, pointerHandlers }: VBTitleBarProps) {
  return (
    <header className="vb-titlebar" {...pointerHandlers}>
      <span className="vb-titlebar__identity">
        <span className="vb-titlebar__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" role="img">
            <path d="M1.5 2.5 13.5 5.5v8L1.5 10.5z" fill="#c0c0c0" stroke="#000" />
            <path d="M2 3 13 5.75V8L2 5.25z" fill="#008000" stroke="#000" strokeWidth="0.5" />
            <path d="M2 5.25 13 8v5L2 10.25z" fill="#fff" stroke="#404040" strokeWidth="0.5" />
            <path d="m4 7.2 5 1.25M4 8.7l6 1.5" stroke="#808080" strokeWidth="0.5" />
          </svg>
        </span>
        <span className="vb-titlebar__caption">{title}</span>
      </span>
      <span className="vb-titlebar__controls">
        <span aria-hidden="true">--</span>
        <button type="button" className="vb-window-close" aria-label={`${title}を閉じる`} disabled={!onClose} onClick={onClose}>
          <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
            <path d="m2 2 6 6M8 2 2 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </span>
    </header>
  );
}
