import { useRef } from "react";
import useClickOutside from "../../../Hook/useClickOutSide";
import styles from "../Shop.module.scss";
import { useSearchParams } from "react-router-dom";

export default function SortDropdown({
  sortType,
  sortOptions,
  openSort,
  setOpenSort,
  setSortType,
  setSearchParams,
  searchParams,
}) {
  const dropDownRef = useRef(null);
  useClickOutside(dropDownRef, () => setOpenSort(false), openSort);

  const handleSelectSort = (option) => {
    const allParams = Object.fromEntries(searchParams.entries());
    const words = option.split(" "); // ["High", "to", "Low"]
    const format = words.map((word, index) => {
        if (index === 0) return word.toLowerCase()
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
    allParams.sort = format;
    console.log(allParams);
    setSearchParams(allParams)
  };

  return (
    <div className={styles.sortDropdownWrapper} ref={dropDownRef}>
      <label onClick={() => setOpenSort(!openSort)}>
        Sort by: <u>{sortType}</u>
      </label>
      {openSort && (
        <div className={styles.sortDropdown}>
          {sortOptions.map((option, i) => (
            <div
              key={i}
              className={`${styles.sortOption} ${
                sortType === option ? styles.active : ""
              }`}
              onClick={() => {
                setSortType(option);
                setOpenSort(false);
                handleSelectSort(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
