import {
  createSchema,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { useEffect } from "react";

interface KlaviyoFormData extends HydrogenComponentProps {
  ref: React.Ref<HTMLDivElement>;
  formId: string;
  maxWidth: number;
  paddingTop: number;
  paddingBottom: number;
}

export default function KlaviyoForm(props: KlaviyoFormData) {
  const {
    ref,
    formId,
    maxWidth,
    paddingTop,
    paddingBottom,
    ...rest
  } = props;

  // Ensure Klaviyo re-renders when editing in Weaverse
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any)._klOnsite) {
      (window as any)._klOnsite.push(["openForm", formId]);
    }
  }, [formId]);

  if (!formId) {
    return (
      <div ref={ref} {...rest} className="text-center text-sm text-gray-500">
        Please set a Klaviyo Form ID.
      </div>
    );
  }

  return (
    <section
      ref={ref}
      {...rest}
      className="flex w-full justify-center"
      style={{
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: `${maxWidth}px`,
        }}
      >
        <div className={`klaviyo-form-${formId}`} />
      </div>
    </section>
  );
}
export const schema = createSchema({
  type: "klaviyo-form",
  title: "Klaviyo Form",
  settings: [
    {
      group: "Form",
      inputs: [
        {
          type: "text",
          label: "Klaviyo Form ID",
          name: "formId",
          defaultValue: "",
          helpText: "Example: AbC123",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          label: "Max width",
          name: "maxWidth",
          configs: {
            min: 400,
            max: 1200,
            step: 50,
            unit: "px",
          },
          defaultValue: 600,
        },
        {
          type: "range",
          label: "Padding top",
          name: "paddingTop",
          configs: {
            min: 0,
            max: 200,
            step: 10,
            unit: "px",
          },
          defaultValue: 60,
        },
        {
          type: "range",
          label: "Padding bottom",
          name: "paddingBottom",
          configs: {
            min: 0,
            max: 200,
            step: 10,
            unit: "px",
          },
          defaultValue: 60,
        },
      ],
    },
  ],
});
