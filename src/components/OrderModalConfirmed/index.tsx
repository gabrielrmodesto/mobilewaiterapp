import { StatusBar } from 'expo-status-bar';
import { Modal } from 'react-native';
import { CheckCircle } from '../Icons/CheckCircle';
import { Text } from '../Text';
import { Container, OkButton } from './styles';

interface OrderModalConfirmedProps{
	visible: boolean;
	onOk: () => void;
}

export function OrderModalConfirmed({visible, onOk}: OrderModalConfirmedProps){
	return(
		<>
			<Modal
				visible={visible}
				animationType='fade'
			>
				<StatusBar style="light" />
				<Container>
					<CheckCircle />
					<Text size={20} weight='600' color='#fff' style={{ marginTop: 12, marginBottom: 4}}>
						Pedido Confirmado
					</Text>
					<Text color='#fff' opacity={.9}>
						O pedido já entro na fila de produção!
					</Text>
					<OkButton onPress={onOk}>
						<Text color='#D73035' weight='600'>OK</Text>
					</OkButton>
				</Container>
			</Modal>
		</>
	);
}
