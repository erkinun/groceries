import { MouseEventHandler } from 'react';

export type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
};

// TODO create the main button too

export function SecondaryButton({ onClick, text }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={'border border-primary text-primaryBold p-2 rounded text-xs'}
    >
      {text}
    </button>
  );
}
