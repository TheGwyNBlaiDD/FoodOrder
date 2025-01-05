import { useContext, useActionState } from "react";
import Modal from "./userInterface/Modal";
import CartContext from "./store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./userInterface/Input";
import Button from "./userInterface/Button";
import userProgressContext from "./store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json'
    }
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(userProgressContext);

    const {data, error, sendRequest, clearData} = useHttp('http://localhost:3000/orders', requestConfig);

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => (totalPrice + item.quantity * item.price), 0);

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    async function checkoutAction(prevState, fd) {
        const customerData = Object.fromEntries(fd.entries()); // { email : text@example.com }

        await sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        );
    }

    const [formState, formAction, isSending] = useActionState(checkoutAction, null);

    let actions = (<>
        <Button type="button" textOnly onClick={handleFinish}>Close</Button>
        <Button>Submit Order</Button>
    </>);

    if (isSending) {
        actions = <span>Sending order data ...</span>
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully</p>
            <p>We will get back to you with more details via within the next few minutes.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

    return (
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form action={formAction}>
                <h2>Chekout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

                <Input label="Full Name" type="text" id="name"/>
                <Input label="E-mail Adress" type="email" id="email"/>
                <Input label="Street" type="text" id="street"/>
                <div className="control-row">
                    <Input label="Postal Code" type="text" id="postal-code"/>
                    <Input label="City" type="text" id="city"/>
                </div>

                {error && <Error title="Failed to submit order" message={error}/>}

                <p className="modal-actions">{actions}</p>
            </form>
        </Modal>
    );
}