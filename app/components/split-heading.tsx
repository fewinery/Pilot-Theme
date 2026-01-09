import type { ComponentProps } from '@weaverse/hydrogen';

export const type = 'split-heading';

export const title = 'Split Heading';

export const settings = [
  {
    id: 'primaryText',
    type: 'text',
    label: 'Primary text (Canela)',
    defaultValue: 'Estate'
  },
  {
    id: 'secondaryText',
    type: 'text',
    label: 'Secondary text (WhiteOleander)',
    defaultValue: 'Wines'
  },
  {
    id: 'fontSize',
    type: 'range',
    label: 'Font size',
    min: 24,
    max: 120,
    step: 2,
    defaultValue: 64
  },
  {
    id: 'align',
    type: 'select',
    label: 'Alignment',
    defaultValue: 'center',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' }
    ]
  }
];

export function Component({
  primaryText,
  secondaryText,
  fontSize,
  align
}: ComponentProps<any>) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent:
          align === 'left'
            ? 'flex-start'
            : align === 'right'
            ? 'flex-end'
            : 'center',
        alignItems: 'baseline',
        gap: '0.25em',
        flexWrap: 'wrap',
        textAlign: align
      }}
    >
      <span
        className="font-canela"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
      >
        {primaryText}
      </span>

      <span
        className="font-whiteoleander"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
      >
        {secondaryText}
      </span>
    </div>
  );
}
