import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context";

function Header(props) {
    const { cartItems } = useContext(AppContext);
    const totalPrice = cartItems.reduce(
        (sum, obj) => Number(obj.price) + Number(sum),
        0
    );

    return (
        <header className="d-flex justify-between align-center p-40">
            <Link to="/">
                <div className="d-flex align-center">
                    <img
                        width={40}
                        height={40}
                        src="./img/logo.png"
                        alt="Logo"
                    />
                    <div>
                        <h3>Sneaker Shop</h3>
                        <p>Discover the best sneakers</p>
                    </div>
                </div>
            </Link>
            <ul className="d-flex">
                <li onClick={props.onClickCart} className="mr-30 cu-p">
                    <img
                        width={18}
                        height={18}
                        src="./img/cart.svg"
                        alt="Cart"
                    />
                    <span>${totalPrice}</span>
                </li>
                <li className="mr-20 cu-p">
                    <Link to="/favorites" exact>
                        <img
                            width={18}
                            height={18}
                            src="./img/heart.svg"
                            alt="Favorites"
                        />
                    </Link>
                </li>
                <li>
                    <img
                        width={18}
                        height={18}
                        src="./img/user.svg"
                        alt="User"
                    />
                </li>
            </ul>
        </header>
    );
}

export default Header;
