import { useContext } from 'react';
import logoImg from '../assets/logo.jpg';
import Button from './userInterface/Button.jsx';
import CartContext from './store/CartContext.jsx';
import userProgressContext from './store/UserProgressContext.jsx';

export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(userProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return (totalNumberOfItems + item.quantity);
    }, 0);

    function handleShowCart () {
        userProgressCtx.showCart();
    }

    return (
        <header id="main-header">
            <div id="title">
                <img src={logoImg} alt="Name of restaurant" />
                <h1>Food Order Shop</h1>
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
            </nav>
        </header>
    );
}