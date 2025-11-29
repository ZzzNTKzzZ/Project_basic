import { Cross, Arrow } from "../../../Assets";
import styles from "../Shop.module.scss";
import Button from "../../../Components/Button";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../../Hook/useClickOutSide";

function FilterItem({ filter, setOpenOptions, setOptionType }) {
  return (
    <div
      className={styles.filterItem}
      onClick={() => {
        setOpenOptions(true);
        setOptionType(filter);
      }}
    >
      <div className={styles.filterInfo}>
        <span className={styles.filterLabel}>{filter}</span>
        <span className={styles.filterCount}>(1)</span>
      </div>
      <div className={styles.filterDetail}>
        <span className={styles.filterType}>(Coats)</span>
        <span className={styles.detailBtn}>
          <Arrow />
        </span>
      </div>
    </div>
  );
}

function OptionItem({ option, filter, setFilter, type }) {
  const toggleSelectFilter = () => {
    setFilter((prev) => {
      const prevOptions = prev[type] || [];
      if (prevOptions.includes(option)) {
        return { ...prev, [type]: prevOptions.filter((o) => o !== option) };
      } else {
        return { ...prev, [type]: [...prevOptions, option] };
      }
    });
  };

  return (
    <label className={styles.optionItem}>
      <input
        type="checkbox"
        className="checkboxInput"
        onChange={toggleSelectFilter}
        checked={filter[type]?.includes(option) || false}
      />
      <span>{option}</span>
    </label>
  );
}

export default function FilterPopup({
  filterOption,
  openFilter,
  setOpenFilter,
  options,
  filter,
  setFilter,
  setSearchParams,
  searchParams
}) {
  const filterRef = useRef(null);
  useClickOutside(filterRef, () => setOpenFilter(false), openFilter);
  const [openOptions, setOpenOptions] = useState(false);
  const [optionType, setOptionType] = useState("");
  const [optionList, setOptionList] = useState([]);

  // Update option list when type changes
  useEffect(() => {
    if (!optionType) return;
    const key = optionType.toLowerCase();
    if (!options[key]) return;
    setOptionList(options[key]);
  }, [optionType, options]);

  const handleSubmitFilter = () => {
    const allParams = Object.fromEntries(searchParams.entries());

    if (filter.category?.length) allParams.category = filter.category.join(",");
    if (filter.minPrice) allParams.minPrice = filter.minPrice;
    if (filter.maxPrice) allParams.maxPrice = filter.maxPrice;

    setSearchParams(allParams);
    setOpenFilter(false);
  };

  const handleClearFilter = () => {
    setFilter({});
    setSearchParams({});
  };

  return (
    <div className={`${styles.filterOverlay} ${openFilter ? styles.open : styles.close}`}>
      <div className={`${styles.filterContainer} ${openOptions ? styles.showOptions : styles.showFilters}`}
        ref={filterRef}
      >
        <div className={styles.popupHeader}>
          {!openOptions ? (
            <>
              <p>FILTER</p>
              <span
                className={styles.closeIcon}
                onClick={() => setOpenFilter(false)}
              >
                <Cross />
              </span>
            </>
          ) : (
            <>
              <span
                className={styles.closeIcon}
                onClick={() => setOpenOptions(false)}
                style={{ left: "0.5rem", right: "" }}
              >
                <Arrow style={{ transform: "scaleX(-1)" }} />
              </span>
              <p>{optionType}</p>
            </>
          )}
        </div>

        {!openOptions ? (
          <div className={styles.popupBody}>
            {filterOption.map((filter, i) => (
              <FilterItem
                key={i}
                filter={filter}
                setOpenOptions={setOpenOptions}
                setOptionType={setOptionType}
              />
            ))}
          </div>
        ) : (
          <div className={styles.optionBody}>
            {optionList.map((option, i) => (
              <OptionItem
                key={i}
                option={option.name}
                filter={filter}
                setFilter={setFilter}
                type={optionType.toLowerCase()}
              />
            ))}
          </div>
        )}

        <div className={styles.popupActions}>
          <Button onClick={handleClearFilter} type={2}>
            Reset all filter
          </Button>
          <Button onClick={handleSubmitFilter}>See all Product</Button>
        </div>
      </div>
    </div>
  );
}
