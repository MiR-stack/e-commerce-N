import { MONEY_SIGN } from "@/constants";

const getRangeValue = (
  setRangeValue,
  maxSize,
  intLowerLimit,
  intUpperLimit,
  isNotValue
) => {
  const checkIsNiceSelect = setInterval(() => {
    const jquery = window.$;

    if (jquery) {
      handleClearInterval();

      $(".slider-range").slider({
        range: true,
        min: intLowerLimit,
        max: maxSize,
        values: [intLowerLimit, intUpperLimit],
        slide: function (event, ui) {
          if (setRangeValue) {
            setRangeValue(`${ui.values[0]}-${ui.values[1]}`);
          }

          $(".amount").val(
            MONEY_SIGN + ui.values[0] + `- ${MONEY_SIGN}` + ui.values[1]
          );
        },
      });
      $(".amount").val(
        MONEY_SIGN +
          $(".slider-range").slider("values", 0) +
          `- ${MONEY_SIGN}` +
          $(".slider-range").slider("values", 1)
      );
    }
  }, 100);

  function handleClearInterval() {
    clearInterval(checkIsNiceSelect);
  }
};

export default getRangeValue;
