import React from "react";
import Select from "react-select";

const customStyles = ({ bgColor, border, borderRadius }) => ({
  control: (provided, state) => ({
    ...provided,
    background: bgColor ?? "#f8faf3",
    minHeight: 40,
    boxShadow: "none",
    fontSize: 14,
    borderRadius: borderRadius ?? 10,
    border: border ?? "none",
    outline: "none",
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#e3e6d3"
      : state.isFocused
      ? "#f0f2ea"
      : "#fff",
    color: "#222",
    fontSize: 14,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1000,
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    fontSize: 12,
    borderTop: state.data?.isFirstGroup ? "none" : "1px solid #e5e7eb",
    paddingTop: state.data?.isFirstGroup ? "8px" : "12px",
  }),
});

function Dropdown({ options, value, onChange, bgColor, grouped, ...rest }) {
  const selectOptions = grouped
    ? options.map((group, index) => ({
        ...group,
        isFirstGroup: index === 0,
        options: group.options.map((cat) => ({
          value: cat.id,
          label: cat.label,
        })),
      }))
    : options.map((option) => ({
        value: option.id,
        label: option.label,
      }));

  // Find the selected option from the nested options
  const selected = grouped
    ? selectOptions
        .map((group) => group.options.find((opt) => opt.value === value))
        .find((opt) => opt !== undefined) || null
    : selectOptions.find((opt) => opt.value === value) || null;

  return (
    <Select
      options={selectOptions}
      value={selected}
      onChange={(opt) => onChange(opt.value)}
      styles={customStyles({ bgColor, ...rest })}
      isSearchable={false}
      menuPlacement="auto"
      {...rest}
    />
  );
}

export default Dropdown;
