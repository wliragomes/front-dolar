import React, { useEffect, useState } from 'react';
import {
    Box, HStack, Button, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer,
    useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
    AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton, Divider, AbsoluteCenter
} from "@chakra-ui/react";
import { getTMRData, postTMRData, deleteTMRData, getPrevisaoData } from '../../services/api';
import ModalCadastro from './modalCadastro';

function CadastroTMS() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [previsaoData, setPrevisaoData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize] = useState(10);
    const [formData, setFormData] = useState({ id: '', data: '', valor: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isDeleteSuccessAlertOpen, setIsDeleteSuccessAlertOpen] = useState(false);
    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);

    useEffect(() => {
        fetchData(pageNumber);
        fetchPrevisaoData();
    }, [pageNumber]);

    const fetchData = async (page) => {
        try {
            const response = await getTMRData(page, pageSize);
            setData(response.data);
            setTotalItems(response.totalItems);
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
        }
    };

    const fetchPrevisaoData = async () => {
        try {
            const response = await getPrevisaoData();
            setPrevisaoData(response);
        } catch (error) {
            console.error('Erro ao buscar previsão da API:', error);
        }
    };

    const handleSave = async () => {
        try {
            const formattedData = {
                ...formData,
                data: new Date(formData.data).toISOString(),
                valor: parseFloat(formData.valor)
            };
            await postTMRData(formattedData);
            setFormData({ id: '', data: '', valor: '' });
            onClose();
            fetchData(pageNumber);
            setIsSuccessAlertOpen(true);
            fetchPrevisaoData(); // Atualiza a previsão após salvar
        } catch (error) {
            console.error('Erro ao enviar dados para a API:', error);
            setIsErrorAlertOpen(true);
        }
    };

    const handleDelete = async (id) => {
        setDeleteId(id);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteTMRData(deleteId);
            onCloseDeleteAlert();
            fetchData(pageNumber);
            setIsDeleteSuccessAlertOpen(true);
            fetchPrevisaoData(); // Atualiza a previsão após excluir
        } catch (error) {
            console.error('Erro ao deletar dados da API:', error);
            setIsErrorAlertOpen(true);
        }
    };

    const onCloseDeleteAlert = () => {
        setIsDeleteAlertOpen(false);
    };

    const onCloseDeleteSuccessAlert = () => {
        setIsDeleteSuccessAlertOpen(false);
    };

    const onCloseSuccessAlert = () => {
        setIsSuccessAlertOpen(false);
    };

    const onCloseErrorAlert = () => {
        setIsErrorAlertOpen(false);
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            data: item.data.split('T')[0], // Format date to YYYY-MM-DD
            valor: item.valor
        });
        setIsEditing(true);
        onOpen();
    };

    const handleNewRecord = () => {
        setIsEditing(false);
        onOpen();
    };

    const handlePreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleNextPage = () => {
        if (pageNumber < Math.ceil(totalItems / pageSize)) {
            setPageNumber(pageNumber + 1);
        }
    };

    return (
        <Box w="100%">
            <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='white' px='4' fontWeight='bold'>
                    Previsão dos próximos 3 dias
                </AbsoluteCenter>
            </Box>

            <TableContainer mb="4">
                <Table variant='striped' colorScheme='teal'>
                    <Thead>
                        <Tr>
                            <Th>Data</Th>
                            <Th isNumeric>Valor</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {previsaoData.map(item => (
                            <Tr key={item.id}>
                                <Td>{new Date(item.data).toLocaleDateString()}</Td>
                                <Td isNumeric>{item.valor.toFixed(2)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            <Box position='relative' padding='10'>
                <Divider />
                <AbsoluteCenter bg='white' px='4' fontWeight='bold'>
                    Histórico
                </AbsoluteCenter>
            </Box>

            <HStack justify="flex-start" mb="4">
                <Button colorScheme="teal" onClick={handleNewRecord}>Novo Registro</Button>
            </HStack>

            <ModalCadastro
                isOpen={isOpen}
                onClose={onClose}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                isEditing={isEditing}
            />

            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onCloseDeleteAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Excluir Registro
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja excluir este registro?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={confirmDelete} colorScheme="red">
                                Excluir
                            </Button>
                            <Button onClick={onCloseDeleteAlert} ml={3}>
                                Cancelar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog
                isOpen={isDeleteSuccessAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onCloseDeleteSuccessAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Registro Excluído
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Registro excluído com sucesso.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onCloseDeleteSuccessAlert} colorScheme="green">
                                Ok
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog
                isOpen={isSuccessAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onCloseSuccessAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Sucesso!
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Registro salvo com sucesso.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onCloseSuccessAlert} colorScheme="green">
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog
                isOpen={isErrorAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onCloseErrorAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Erro!
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Ocorreu um erro ao processar a operação.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onCloseErrorAlert} colorScheme="red">
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    <Thead>
                        <Tr>
                            <Th>Data</Th>
                            <Th isNumeric>Valor</Th>
                            <Th isNumeric></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map(item => (
                            <Tr key={item.id}>
                                <Td>{new Date(item.data).toLocaleDateString()}</Td>
                                <Td isNumeric>{item.valor.toFixed(2)}</Td>
                                <Td isNumeric>
                                    <HStack spacing="2" justifyContent="flex-end">
                                        <Button colorScheme="blue" onClick={() => handleEdit(item)}>Editar</Button>
                                        <Button colorScheme="red" onClick={() => handleDelete(item.id)}>Excluir</Button>
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <HStack justify="space-between" mt="4">
                <Button onClick={handlePreviousPage} disabled={pageNumber === 1}>Anterior</Button>
                <Button onClick={handleNextPage} disabled={pageNumber >= Math.ceil(totalItems / pageSize)}>Próxima</Button>
            </HStack>
        </Box>
    );
}

export default CadastroTMS;
