import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";

interface WaveSpacerData extends HydrogenComponentProps {
  ref: React.Ref<HTMLDivElement>;
  height: number;
  color: string;
}

export default function WaveSpacer(props: WaveSpacerData) {
  const { ref, height, color, ...rest } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className="w-full overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <svg
        className="w-full h-full block-overlay"
        preserveAspectRatio="none"
        viewBox="0 0 1440 63"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1440,63 L0,63 L0,24.6912691 C269.927631,-8.23042304 550.625545,-8.23042304 842.093742,24.6912691 C1133.56194,57.6129613 1332.86402,50.6138614 1440,3.6939694 L1440,63 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export const schema = createSchema({
  type: "wavespacer",
  title: "Wave Spacer",
  settings: [
    {
      group: "Wave Spacer",
      inputs: [
        {
          type: "range",
          label: "Height",
          name: "height",
          defaultValue: 120,
          configs: {
            min: 20,
            max: 400,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "color",
          label: "Fill color",
          name: "color",
          defaultValue: "#ffffff",
        },
      ],
    },
  ],
});
