import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";

interface SpacerData extends HydrogenComponentProps {
  ref: React.Ref<HTMLDivElement>;
  mobileHeight: number;
  desktopHeight: number;
  backgroundColor: string;
  addSeparator: boolean;
  separatorColor: string;

  // New wave options
  addWave: boolean;
  waveColor: string;
}

export default function WeaverseSpacer(props: SpacerData) {
  const {
    ref,
    mobileHeight,
    desktopHeight,
    backgroundColor,
    addSeparator,
    separatorColor,

    // new props
    addWave,
    waveColor,

    ...rest
  } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className="flex h-(--mobile-height) w-full items-center justify-center md:h-(--desktop-height)"
      style={
        {
          backgroundColor,
          "--mobile-height": `${mobileHeight}px`,
          "--desktop-height": `${desktopHeight}px`,
          "--separator-color": separatorColor,
        } as React.CSSProperties
      }
    >
      {/* original border separator */}
      {addSeparator && (
        <div className="mx-auto h-px w-3/4 border-(--separator-color,var(--color-border)) border-t md:w-2/3" />
      )}

      {/* wavy SVG divider */}
      {addWave && (
        <svg
          className="block w-full h-auto"
          preserveAspectRatio="none"
          viewBox="0 0 1440 63"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginTop: "-1px" }}
        >
          <path
            d="M1440,63 L0,63 L0,24.6912691
               C269.927631,-8.23042304 550.625545,-8.23042304 842.093742,24.6912691
               C1133.56194,57.6129613 1332.86402,50.6138614 1440,3.6939694
               L1440,63 Z"
            fill={waveColor}
          />
        </svg>
      )}
    </div>
  );
}

export const schema = createSchema({
  type: "weaverse-spacer", // NEW UNIQUE TYPE
  title: "Weaverse Spacer", // VISIBLE NAME IN STUDIO

  settings: [
    {
      group: "Spacer",
      inputs: [
        {
          type: "range",
          label: "Mobile height",
          name: "mobileHeight",
          configs: {
            min: 0,
            max: 200,
            step: 1,
            unit: "px",
          },
          defaultValue: 50,
          helpText: "Set to 0 to hide the spacer on mobile",
        },
        {
          type: "range",
          label: "Desktop height",
          name: "desktopHeight",
          configs: {
            min: 0,
            max: 300,
            step: 1,
            unit: "px",
          },
          defaultValue: 100,
        },
        {
          type: "color",
          label: "Background color",
          name: "backgroundColor",
          defaultValue: "#00000000",
        },
        {
          type: "switch",
          label: "Add border separator",
          name: "addSeparator",
          defaultValue: false,
        },
        {
          type: "color",
          label: "Separator color",
          name: "separatorColor",
          defaultValue: "#000",
          condition: (data: SpacerData) => data.addSeparator,
        },

        // NEW wave controls
        {
          type: "switch",
          label: "Add wavy divider",
          name: "addWave",
          defaultValue: true,
        },
        {
          type: "color",
          label: "Wavy divider color",
          name: "waveColor",
          defaultValue: "#ffffff",
          condition: (data: SpacerData) => data.addWave,
        },
      ],
    },
  ],
});
