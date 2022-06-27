const numberInputArea  = document.getElementById('num');
const baseInputArea    = document.getElementById('bse');
const resultOutputArea = document.getElementById('res');
const elements         = [numberInputArea, baseInputArea, resultOutputArea]

function logCalc(bse, num) {
	return Math.log(num) / Math.log(bse);
}

function showCalcResult(calcIn1, calcIn2, calcOut, calcFunc) {
	calcOut.textContent = calcFunc(calcIn1.value, calcIn2.value);
}

window.addEventListener('load', function () {
	elements.forEach(function (element) {
		setInputFilter(element, function (value) {
			return /^\d*\.?\d*$/.test(value);
			
			// At the beginning, zero or more digits
			// followed by an optional decimal point,
			// followed by zero or more digits and the end of the string.
		}, 'Numbers only!');
	})
});

window.addEventListener('keydown', function (e) {
	switch (e.key) {
		case 'SoftLeft':
			numberInputArea.focus();
			numberInputArea.value = null;
			break;
		case 'Enter':
			elements.forEach(function (element) {
				element.blur();
			});
			showCalcResult(baseInputArea, numberInputArea, resultOutputArea, logCalc);
			break;
		case 'SoftRight':
			baseInputArea.focus();
			baseInputArea.value = null
			break;
	}
});

// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter, errMsg) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
		textbox.addEventListener(event, function(e) {
			if (inputFilter(this.value)) {
				// Accepted value
				if (["keydown","mousedown","focusout"].indexOf(e.type) >= 0){
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