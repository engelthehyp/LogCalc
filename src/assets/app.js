const NUMBER_INPUT_AREA = document.getElementById('number');
const BASE_INPUT_AREA = document.getElementById('base');
const RESULT_OUTPUT_AREA = document.getElementById('result');
const INPUT_OUTPUT_ELEMENTS = [NUMBER_INPUT_AREA, BASE_INPUT_AREA, RESULT_OUTPUT_AREA];

// At the beginning, zero or more digits
// followed by an optional decimal point,
// followed by zero or more digits and the end of the string.
const VALID_DECIMAL_REGEX = /^\d*\.?\d*$/;

window.addEventListener('load', () =>
	INPUT_OUTPUT_ELEMENTS.forEach(element =>
		setInputFilter(element, value =>
			VALID_DECIMAL_REGEX.test(value), 'Numbers only!'))
);

window.addEventListener('keydown', e => 
	void {
		'SoftLeft': handleSoftLeft,
		'SoftRight': handleSoftRight,
		'Enter': handleEnter,
	}[e.key]?.()
);

// Implemented using change-of-base formula.
const calculateLog = (base, num) => Math.log(num) / Math.log(base);

const showCalculationResult = (input1Area, input2Area, outputArea, func)
	=> outputArea.textContent = func(input1Area.value, input2Area.value);

const handleSoftLeft = () => {
	NUMBER_INPUT_AREA.focus();
	NUMBER_INPUT_AREA.value = null;
}

const handleEnter = () => {
	INPUT_OUTPUT_ELEMENTS.forEach(element => element.blur());
	showCalculationResult(BASE_INPUT_AREA, NUMBER_INPUT_AREA, RESULT_OUTPUT_AREA, calculateLog);
}

const handleSoftRight = () => {
	BASE_INPUT_AREA.value = null;
	BASE_INPUT_AREA.focus();
}

// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter, errMsg) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
		textbox.addEventListener(event, function (e) {
			if (inputFilter(this.value)) {
				// Accepted value
				if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
					this.classList.remove("input-error");
					this.setCustomValidity("");
				}
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				// Rejected value - restore the previous one
				this.classList.add("input-error");
				this.setCustomValidity(errMsg);
				this.reportValidity();
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			} else {
				// Rejected value - nothing to restore
				this.value = "";
			}
		});
	});
}