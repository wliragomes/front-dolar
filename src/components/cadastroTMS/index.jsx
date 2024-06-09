import React, { useEffect, useState } from 'react';
import {
    Box, HStack, Button, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,
    useDisclosure,
} from "@chakra-ui/react";
import { getTMRData, postTMRData, deleteTMRData } from '../../services/api';
import ModalCadastro from './modalCadastro';

function CadastroTMS() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize] = useState(10);
    const [formData, setFormData] = useState({ id: '', data: '', valor: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData(pageNumber);
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
        } catch (error) {
            console.error('Erro ao enviar dados para a API:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir este registro?');
        if (confirmDelete) {
            try {
                await deleteTMRData(id);
                fetchData(pageNumber);
            } catch (error) {
                console.error('Erro ao deletar dados da API:', error);
            }
        }
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
            <HStack justify="flex-end" mb="4">
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

            <TableContainer>
                <Table variant='striped' colorScheme='teal'>
                    <TableCaption>Histórico</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Data</Th>
                            <Th>Valor</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map(item => (
                            <Tr key={item.id}>
                                <Td>{new Date(item.data).toLocaleDateString()}</Td>
                                <Td>{item.valor.toFixed(2)}</Td>
                                <Td>
                                    <HStack spacing="2">
                                        <Button colorScheme="blue" onClick={() => handleEdit(item)}>Editar</Button>
                                        <Button colorScheme="red" onClick={() => handleDelete(item.id)}>Excluir</Button>
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Data</Th>
                            <Th>Valor</Th>
                            <Th>Ações</Th>
                        </Tr>
                    </Tfoot>
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
