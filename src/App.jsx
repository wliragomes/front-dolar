import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Center } from "@chakra-ui/react";
import Home from './components/home';
import CadastroTMS from './components/cadastroTMS';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Box h="100vh">
                    <Flex as="nav" bg="teal.500" p="4" color="white">
                        <Box mr="4">
                            <Link to="/">Home</Link>
                        </Box>
                        <Box>
                            <Link to="/cadastro-tms">Cadastro TMS</Link>
                        </Box>
                    </Flex>
                    <Flex align="center" justify="center" bg="blackAlpha.200" h="calc(100vh - 72px)">
                        <Center w="100%" maxW={840} bg="white" borderRadius={5} p="6" boxShadow="0 1px 2px #ccc">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/cadastro-tms" element={<CadastroTMS />} />
                            </Routes>
                        </Center>
                    </Flex>
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;
