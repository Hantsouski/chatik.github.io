import QRCodeStyling from 'qr-code-styling';
import { Component } from '@thi.ng/rdom';
import type { NumOrElement } from '@thi.ng/rdom';
import { qrCodeLink } from '../../../../state';

export class QrCode extends Component {
  async mount(parent: Element, index?: NumOrElement) {
    const el = this.$el(
      'div#qr-container',
      { style: 'text-align: center '},
      'Loading...',
      parent,
      index
    );

    this.el = el;

    qrCodeLink.map(url => {
      const qrCode = new QRCodeStyling({
        width: 280,
        height: 280,
        data: url as string,
        image: '',
        dotsOptions: {
          color: 'oklch(75.54% 0.153 231.64)',
          type: 'rounded',
        },
        backgroundOptions: {
          color: 'transparent',
        },
      });

      const container = document.getElementById('qr-container')! as HTMLDivElement;
      container.innerHTML = '';
      qrCode.append(container);
    })

    return el;
  }

  async unmount(): Promise<void> {
    this.el!.innerHTML = '';
  }
}

export const qrCode = () => new QrCode();
