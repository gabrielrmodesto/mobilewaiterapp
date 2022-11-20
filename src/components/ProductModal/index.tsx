import { Modal } from 'react-native';
import { Product } from '../../types/Product';
import { Close } from '../Icons/Close';
import { Text } from '../Text';
import { CloseButton, Image } from './styles';

interface ProductModalProps{
	visible: boolean;
	onClose: () => void;
	product: null | Product;
}

export function ProductModal({visible, onClose, product}: ProductModalProps){
	if(!product){
		return null;
	}

	return(
		<>
			<Modal
				visible={visible}
				animationType='slide'
				presentationStyle='pageSheet'
				onRequestClose={onClose}
			>
				<Image
					source={{
						uri: `http://192.168.1.65:3001/uploads/${product.imagePath}`
					}}
				>
					<CloseButton>
						<Close />
					</CloseButton>
				</Image>
			</Modal>
		</>
	);
}
