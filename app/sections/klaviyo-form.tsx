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
