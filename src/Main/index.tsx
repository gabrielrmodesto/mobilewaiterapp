import { useState } from 'react';
import { Button } from '../components/Button';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { Cart } from '../components/Cart';
import { Container, CategoryContainer, MenuContainer, Footer, FooterContainer } from './styles';
import { CartItem } from '../types/CartItem';
import { products } from '../mocks/products';
import { Product } from '../types/Product';

export function Main(){
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([
		// {
		// 	quantity: 1,
		// 	product: products[0]
		// },
		// {
		// 	quantity: 1,
		// 	product: products[1]
		// },
	]);

	function handleSaveTable(table: string){
		setSelectedTable(table);
	}

	function handleCancelOrder(){
		setSelectedTable('');
		setCartItems([]);
	}

	function handleAddToCart(product: Product){
		if(!selectedTable){
			setIsTableModalVisible(true);
		}
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				cartItem => cartItem.product._id === product._id
			);
			if(itemIndex < 0){
				return prevState.concat({
					quantity: 1,
					product
				});
			}

			const newCartItems = [...prevState];
			const item = newCartItems[itemIndex];

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity + 1,
			};

			return newCartItems;
		});
	}
	function handleRemoveCartItem(product: Product){
		setCartItems((prevState) => {
			const itemIndex = prevState.findIndex(
				cartItem => cartItem.product._id === product._id
			);
			const item = prevState[itemIndex];
			const newCartItems = [...prevState];

			if(item.quantity === 1){
				newCartItems.splice(itemIndex, 1);

				return newCartItems;
			}

			newCartItems[itemIndex] = {
				...item,
				quantity: item.quantity - 1,
			};

			return newCartItems;
		});
	}
	return(
		<>
			<Container>
				<Header selectedTable={selectedTable} onCancelOrder={handleCancelOrder}/>
				<CategoryContainer>
					<Categories />
				</CategoryContainer>
				<MenuContainer>
					<Menu onAddToCart={handleAddToCart} />
				</MenuContainer>
			</Container>
			<Footer>
				{/* <FooterContainer> */}
				{!selectedTable && (
					<Button onPress={() => setIsTableModalVisible(true)}>
						Novo pedido
					</Button>
				)}
				{selectedTable && (
					<Cart
						cartItems={cartItems}
						onAdd={handleAddToCart}
						onRemove={handleRemoveCartItem}
					/>
				)}
				{/* </FooterContainer> */}
			</Footer>

			<TableModal
				visible={isTableModalVisible}
				onClose={() => setIsTableModalVisible(false)}
				onSave={handleSaveTable}
			/>
		</>
	);
}
