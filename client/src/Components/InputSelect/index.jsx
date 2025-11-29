import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./InputSelect.module.scss";
import useClickOutside from "../../Hook/useClickOutSide";
import useSearch from "../../Hook/useSearch";

export default function InputSelect({
  placeholder,
  className,
  apiUrl,
  query,
  setQuery,
  disabled,
  passprop,
}) {
  const [value, setValue] = useState("");
  const { result } = useSearch(apiUrl, query);

  const nameKey = apiUrl.includes("wards") ? "ward_name" : "name";
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync input value with selected object
  useEffect(() => {
    if (query?.[nameKey]) setValue(query[nameKey]);
  }, [query, nameKey]);

  const filteredOptions = result.filter(
    (opt) =>
      typeof opt === "object" &&
      opt?.[nameKey]?.toLowerCase().includes(value.toLowerCase())
  );

  console.log(result)

  const inputRef = useRef(null);
  useClickOutside(inputRef, () => setShowDropdown(false), showDropdown);

  const classNames = clsx(styles.wrapper, className, {
    [styles.disabled]: disabled,
  });

  return (
    <div className={classNames} {...passprop}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          if(disabled) return;
          setValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        disabled={!!disabled} 
      />

      {showDropdown && filteredOptions.length > 0 && (
        <ul className={styles.list}>
          {filteredOptions.map((opt, index) => (
            <li
              key={index}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur
                setValue(opt[nameKey]);
                setQuery(opt); // update parent state
                setShowDropdown(false);
              }}
            >
              {opt[nameKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
