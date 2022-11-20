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

export function Main(){
	const [isTableModalVisible, setIsTableModalVisible] = useState(false);
	const [selectedTable, setSelectedTable] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{
			quantity: 1,
			product: products[0]
		},
		{
			quantity: 1,
			product: products[1]
		}
	]);

	function handleSaveTable(table: string){
		setSelectedTable(table);
	}

	function handleCancelOrder(){
		setSelectedTable('');
	}

	return(
		<>
			<Container>
				<Header selectedTable={selectedTable} onCancelOrder={handleCancelOrder}/>
				<CategoryContainer>
					<Categories />
				</CategoryContainer>
				<MenuContainer>
					<Menu />
				</MenuContainer>
			</Container>
			<Footer>
				<FooterContainer>
					{!selectedTable && (
						<Button onPress={() => setIsTableModalVisible(true)}>
							Novo pedido
						</Button>
					)}
					{selectedTable && (
						<Cart cartItems={cartItems} />
					)}
				</FooterContainer>
			</Footer>

			<TableModal
				visible={isTableModalVisible}
				onClose={() => setIsTableModalVisible(false)}
				onSave={handleSaveTable}
			/>
		</>
	);
}
