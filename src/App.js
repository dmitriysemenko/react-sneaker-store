import { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import AppContext from "./context";
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
    const [isLoading, setIsLoading] = useState(true);

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

            setIsLoading(false);
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
            if (
                favorites.find((favObj) => Number(favObj.id) === Number(obj.id))
            ) {
                axios.delete(
                    `https://614a2aed07549f001755a831.mockapi.io/favorites/${obj.id}`
                );
                setFavorites((prev) =>
                    prev.filter((item) => Number(item.id) === Number(obj.id))
                );
            } else {
                const { data } = await axios.post(
                    "https://614a2aed07549f001755a831.mockapi.io/favorites",
                    obj
                );
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert("Failed to add to favorites");
            console.log(error);
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.id) === Number(id));
    };

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                onAddToFavorite,
                setCartOpened,
                setCartItems,
            }}
        >
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
                        isLoading={isLoading}
                    />
                </Route>

                <Route path="/favorites" exact>
                    <Favorites />
                </Route>
            </div>
        </AppContext.Provider>
    );
}

export default App;
