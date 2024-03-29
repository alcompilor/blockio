import { TransactionResponse } from "../../classes/EthClient/types/transaction";
import * as Fallback from "../Fallback/Fallback";
import "../../../scss/transfer.scss";
import { displayNotice } from "../../utils/DOM/displayNotice";
import { agent } from "../../global/agent";

const initTransaction = async (
    addressVal: string,
    amountVal: number
): Promise<TransactionResponse> => {
    return await agent.send(addressVal, amountVal);
};

const addressInputEvent = (
    input: HTMLInputElement,
    btn: HTMLButtonElement,
    notice: HTMLSpanElement,
    form: HTMLFormElement
): void => {
    input.addEventListener("input", (): void => {
        if (input.checkValidity()) {
            if (form.checkValidity()) btn.disabled = false;
            displayNotice(notice, "");
        } else {
            btn.disabled = true;
            displayNotice(notice, "Ensure the wallet address is valid");
        }
    });
};

const amountInputEvent = (
    input: HTMLInputElement,
    btn: HTMLButtonElement,
    notice: HTMLSpanElement,
    form: HTMLFormElement
): void => {
    input.addEventListener("input", (): void => {
        if (Number(input.value.trim()) > 0) {
            if (form.checkValidity()) btn.disabled = false;
            displayNotice(notice, "");
        } else {
            btn.disabled = true;
            displayNotice(notice, "Ensure the amount is valid");
        }
    });
};

const btnEvent = (
    btn: HTMLButtonElement,
    addressInput: HTMLInputElement,
    amountInput: HTMLInputElement,
    notice: HTMLSpanElement,
    title: HTMLHeadingElement
): void => {
    btn.addEventListener("click", async (): Promise<void> => {
        displayNotice(notice, "");
        const addressVal: string = addressInput.value.trim();
        const amountVal: number = +amountInput.value.trim();

        try {
            const fallback: Record<string, Function> = Fallback.buildComponent(
                title,
                80
            );
            const txRes: TransactionResponse = await initTransaction(
                addressVal,
                amountVal
            );
            fallback.remove();

            if (txRes.status) {
                displayNotice(
                    notice,
                    `Transaction has been processed.\nTransaction Hash: ${txRes.hash}`
                );
            } else {
                handleTransactionError(notice, txRes.error!.code);
            }
        } catch (err) {
            displayNotice(
                notice,
                "An error occurred while initiating the transaction"
            );
        }
    });
};

const handleTransactionError = (
    notice: HTMLSpanElement,
    errorCode: number
): void => {
    switch (errorCode) {
        case 4001:
            displayNotice(
                notice,
                "Transaction Rejected: The user declined the transaction."
            );
            break;
        case 4900:
        case 4901:
            displayNotice(
                notice,
                "Wallet Disconnected: Please reconnect your wallet and try again."
            );
            break;
        default:
            displayNotice(
                notice,
                "Transaction Error: Unable to process the transaction.\nPlease check the amount or recipient address and try again."
            );
            break;
    }
};

const buildComponent = (): HTMLElement => {
    const formContainer: HTMLElement = document.createElement("section");
    formContainer.className = "transaction-form-container";

    const formTitle: HTMLHeadingElement = document.createElement("h2");
    formTitle.textContent = "Transfer Funds";

    const formNotice: HTMLSpanElement = document.createElement("span");
    formNotice.className = "transaction-form-notice";
    formNotice.style.display = "none";

    const form: HTMLFormElement = document.createElement("form");
    const fieldSet: HTMLFieldSetElement = document.createElement("fieldset");

    const wAddressInput: HTMLInputElement = document.createElement("input");
    wAddressInput.type = "text";
    wAddressInput.placeholder = "Enter recipient wallet address";
    wAddressInput.className = "toaddress-input";
    wAddressInput.pattern = "^0x.*";
    wAddressInput.required = true;

    const amountInput: HTMLInputElement = document.createElement("input");
    amountInput.type = "number";
    amountInput.placeholder = `Amount in ${localStorage.getItem("blockioCurrency") || "ETH"}`;
    amountInput.className = "amount-input";
    amountInput.step = "any";
    amountInput.required = true;

    const submitBtn: HTMLButtonElement = document.createElement("button");
    submitBtn.textContent = "Send";
    submitBtn.disabled = true;

    addressInputEvent(wAddressInput, submitBtn, formNotice, form);
    amountInputEvent(amountInput, submitBtn, formNotice, form);
    btnEvent(submitBtn, wAddressInput, amountInput, formNotice, formTitle);

    fieldSet.append(wAddressInput, amountInput);
    form.appendChild(fieldSet);

    formContainer.append(formTitle, formNotice, form, submitBtn);
    return formContainer;
};

export { buildComponent };
