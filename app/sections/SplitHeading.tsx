import { defineSection } from '@weaverse/hydrogen';
import type { SectionProps } from '@weaverse/hydrogen';

type SplitHeadingProps = SectionProps<{
  primaryText: string;
  secondaryText: string;
  fontSize: number;
  align: 'left' | 'center' | 'right';
}>;

function SplitHeading({
  primaryText,
  secondaryText,
  fontSize,
  align
}: SplitHeadingProps) {
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
        style={{
          fontFamily: 'Canela, serif',
          fontSize: `${fontSize}px`,
          lineHeight: 1.1
        }}
      >
        {primaryText}
      </span>

      <span
        style={{
          fontFamily: 'WhiteOleander, cursive',
          fontSize: `${fontSize}px`,
          lineHeight: 1.1
        }}
      >
        {secondaryText}
      </span>
    </div>
  );
}

export default defineSection(SplitHeading, {
  name: 'Split Heading',
  description: 'Heading with two fonts on one line',
  category: 'Text',
  settings: [
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
  ]
});
