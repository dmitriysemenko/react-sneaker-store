import { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [cartOpened, setCartOpened] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const cartResponse = await axios.get(
                "https://614a2aed07549f001755a831.mockapi.io/cart"
            );

            const favoritesResponse = await axios.get(
                "https://614a2aed07549f001755a831.mockapi.io/favorites"
            );
            const itemsResponse = await axios.get(
                "https://614a2aed07549f001755a831.mockapi.io/items"
            );

            setCartItems(cartResponse.data);
            setFavorites(favoritesResponse.data);
            setItems(itemsResponse.data);
        }

        fetchData();
    }, []);

    const onAddToCart = (obj) => {
        if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            axios.delete(
                `https://614a2aed07549f001755a831.mockapi.io/cart/${obj.id}`
            );
            setCartItems((prev) =>
                prev.filter((item) => Number(item.id) !== Number(obj.id))
            );
        } else {
            axios.post("https://614a2aed07549f001755a831.mockapi.io/cart", obj);
            setCartItems((prev) => [...prev, obj]);
        }
    };

    const onRemoveItem = (id) => {
        axios.delete(`https://614a2aed07549f001755a831.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find((favObj) => favObj.id === obj.id)) {
                axios.delete(
                    `https://614a2aed07549f001755a831.mockapi.io/favorites/${obj.id}`
                );
            } else {
                const { data } = await axios.post(
                    "https://614a2aed07549f001755a831.mockapi.io/favorites",
                    obj
                );
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert("Failed to add to cart");
            console.log(error);
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <div className="wrapper clear">
            {cartOpened && (
                <Drawer
                    items={cartItems}
                    onClose={() => {
                        setCartOpened(false);
                    }}
                    onRemove={onRemoveItem}
                />
            )}
            <Header onClickCart={() => setCartOpened(true)} />

            <Route path="/" exact>
                <Home
                    items={items}
                    cartItems={cartItems}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onChangeSearchInput={onChangeSearchInput}
                    onAddToCart={onAddToCart}
                    onAddToFavorite={onAddToFavorite}
                />
            </Route>

            <Route path="/favorites" exact>
                <Favorites
                    items={favorites}
                    onAddToFavorite={onAddToFavorite}
                />
            </Route>
        </div>
    );
}

export default App;
