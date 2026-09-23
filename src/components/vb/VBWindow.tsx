import type { ReactNode, Ref } from 'react';
import { VBMenuBar } from './VBMenuBar';
import { VBStatusBar } from './VBStatusBar';
import { VBTitleBar } from './VBTitleBar';
import type { TitleBarPointerHandlers } from './VBTitleBar';

export type VBFormProps = {
  title: string;
  children: ReactNode;
  status?: string;
  showMenu?: boolean;
  embedded?: boolean;
  windowRef?: Ref<HTMLElement>;
  onClose?: () => void;
  titleBarProps?: TitleBarPointerHandlers;
};

export function VBWindow({
  title,
  children,
  status = 'Ready',
  showMenu = false,
  embedded = false,
  windowRef,
  onClose,
  titleBarProps,
}: VBFormProps) {
  const windowFrame = (
    <section className="vb-window" aria-label={title} ref={windowRef}>
      <VBTitleBar title={title} onClose={onClose} pointerHandlers={titleBarProps} />
      {showMenu && <VBMenuBar />}
      <div className="vb-client-area">{children}</div>
      <VBStatusBar message={status} />
    </section>
  );
  return embedded ? windowFrame : <main className="vb-desktop">{windowFrame}</main>;
}
