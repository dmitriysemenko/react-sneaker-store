import { useState, useEffect } from "react";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Card from "./components/Card";

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartOpened, setCartOpened] = useState(false);

    useEffect(() => {
        fetch("https://614a2aed07549f001755a831.mockapi.io/items")
            .then((res) => {
                return res.json();
            })
            .then((json) => setItems(json));
    }, []);

    const onAddToCart = (obj) => {
        setCartItems((prev) => [...prev, obj]);
    };

    return (
        <div className="wrapper clear">
            {cartOpened && (
                <Drawer
                    items={cartItems}
                    onClose={() => {
                        setCartOpened(false);
                    }}
                />
            )}
            <Header onClickCart={() => setCartOpened(true)} />
            <div className="content p-40">
                <div className="d-flex align-center justify-between mb-40">
                    <h1>All Items</h1>
                    <div className="search-block d-flex">
                        <img src="./img/search.svg" alt="Search" />
                        <input placeholder="Search..." />
                    </div>
                </div>
                <div className="d-flex flex-wrap">
                    {items.map((item) => (
                        <Card
                            title={item.title}
                            price={item.price}
                            imageUrl={item.imageUrl}
                            onFavorite={() => console.log("Added to favorites")}
                            onPlus={(obj) => onAddToCart(obj)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
