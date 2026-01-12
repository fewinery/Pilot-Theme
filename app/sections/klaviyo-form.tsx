import { forwardRef } from "react";
import type { WeaverseSectionProps } from "@weaverse/hydrogen";

export const Component = forwardRef<HTMLDivElement, WeaverseSectionProps>(
  (props, ref) => {
    const { formId } = props.settings;

    if (!formId) return null;

    return (
      <div ref={ref} className="klaviyo-form-wrapper">
        <div className={`klaviyo-form-${formId}`} />
      </div>
    );
  }
);

Component.displayName = "KlaviyoForm";

export const schema = {
  type: "klaviyo-form",
  title: "Klaviyo Form",
  inspector: [
    {
      group: "Klaviyo",
      inputs: [
        {
          type: "text",
          name: "formId",
          label: "Klaviyo Form ID",
          placeholder: "AbCdEf",
        },
      ],
    },
  ],
};
