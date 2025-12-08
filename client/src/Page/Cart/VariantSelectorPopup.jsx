import Button from "../../Components/Button";
import styles from "./CartPage.module.scss";

export default function VariantSelectorPopup({ variations, selectedOptions, onSelectOption }) {
  const variantKeys = Object.keys(variations || {});

  return (
    <div className={styles.variantPopup}>
      {variantKeys.map((key) => {
        const optionName = key.endsWith("s") ? key.slice(0, -1) : key;
        const options = variations[key];

        return (
          <div key={key} className={styles.variantBlock}>
            <span className={styles.variantLabel}>
              {optionName.charAt(0).toUpperCase() + optionName.slice(1)}
            </span>
            <div className={styles.optionGroup}>
              {options.map((value) => (
                <Button
                  key={value}
                  type={2}
                  className={styles.option}
                  active={value === selectedOptions[optionName]}
                  onClick={() => onSelectOption?.(optionName, value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
