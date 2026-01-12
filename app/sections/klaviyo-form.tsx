import { forwardRef } from "react";
import { type WeaverseSectionProps } from "@weaverse/hydrogen";

const KlaviyoForm = forwardRef<HTMLDivElement, WeaverseSectionProps>(
  (props, ref) => {
    const { formId } = props.settings;

    return (
      <div ref={ref} className="klaviyo-form-wrapper">
        <div className={`klaviyo-form-${formId}`} />
      </div>
    );
  }
);

export default KlaviyoForm;

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
          helpText: "Paste the Klaviyo embed form ID (from class klaviyo-form-XXXX)",
        },
      ],
    },
  ],
};
