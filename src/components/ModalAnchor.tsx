import { createPortal } from 'react-dom';

export function ModalAnchor({ children }: { children: Children }) {
    const el = document.getElementById('modal-root');
    if (el == null) throw new Error('modal-root null');
    return createPortal(children, el);
}
