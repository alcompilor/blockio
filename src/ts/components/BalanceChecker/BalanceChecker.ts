import "../../../scss/balance.scss";
import { displayNotice } from "../../utils/DOM/displayNotice";
import { agent } from "../../global/agent";

const getBalance = async (inputVal: string): Promise<number> => {
    return await agent.balance(inputVal, 4);
};

const inputEvent = (
    input: HTMLInputElement,
    btn: HTMLButtonElement,
    notice: HTMLSpanElement
): void => {
    input.addEventListener("input", (): void => {
        const wAddressRegex: RegExp = /^0x/;

        if (wAddressRegex.test(input.value.trim())) {
            btn.disabled = false;
            displayNotice(notice, "");
        } else {
            btn.disabled = true;
            displayNotice(notice, "Ensure the wallet address is valid");
        }
    });
};

const btnEvent = (
    btn: HTMLButtonElement,
    input: HTMLInputElement,
    notice: HTMLSpanElement
): void => {
    btn.addEventListener("click", async (): Promise<void> => {
        const inputVal: string = input.value.trim();

        try {
            const balance: number = await getBalance(inputVal);
            displayNotice(
                notice,
                `${balance} ${localStorage.getItem("blockioCurrency") || "ETH"}`
            );
        } catch (err: any) {
            displayNotice(
                notice,
                "An error occurred while getting the balance"
            );
        }
    });
};

const buildComponent = (): HTMLElement => {
    const formContainer: HTMLElement = document.createElement("section");
    formContainer.className = "balance-form-container";

    const formTitle: HTMLHeadingElement = document.createElement("h2");
    formTitle.textContent = "Balance Tracker";

    const formNotice: HTMLSpanElement = document.createElement("span");
    formNotice.className = "balance-form-notice";
    formNotice.style.display = "none";

    const form: HTMLFormElement = document.createElement("form");
    const fieldSet: HTMLFieldSetElement = document.createElement("fieldset");

    const wAddressInput: HTMLInputElement = document.createElement("input");
    wAddressInput.type = "text";
    wAddressInput.placeholder = "Enter a wallet address";
    wAddressInput.className = "address-input";

    const submitBtn: HTMLButtonElement = document.createElement("button");
    submitBtn.textContent = "Check";
    submitBtn.disabled = true;

    inputEvent(wAddressInput, submitBtn, formNotice);
    btnEvent(submitBtn, wAddressInput, formNotice);

    fieldSet.appendChild(wAddressInput);
    form.appendChild(fieldSet);

    formContainer.append(formTitle, formNotice, form, submitBtn);
    return formContainer;
};

export { buildComponent };
