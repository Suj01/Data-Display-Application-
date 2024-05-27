import { Box, Heading, SimpleGrid, Text, Input, Button, Select, Flex, useColorMode, useColorModeValue, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const Data = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue("white", "gray.800");
    const color = useColorModeValue("black", "white");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 6;
    const cancelRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://jsonplaceholder.typicode.com/posts");
                const post = await res.json();
                setData(post);
                setFilteredData(post);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, sortOrder]);

    const handleSearch = (term) => {
        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(term.toLowerCase())
        );
        const sorted = filtered.sort((a, b) => {
            if (sortOrder === "asc") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
        setFilteredData(sorted);
        setCurrentPage(1);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const handlePageChange = (page) => {
        if (page > totalPages) {
            setIsModalOpen(true);
            return;
        }
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const gradients = [
        "linear(to-r, teal.500, green.500)",
        "linear(to-r, orange.500, yellow.500)",
        "linear(to-r, purple.500, pink.500)",
        "linear(to-r, blue.500, cyan.500)",
        "linear(to-r, red.500, yellow.500)",
        "linear(to-r, green.500, blue.500)",
    ];

    return (
        <Box p={5} bg={bg} color={color}>
            <Flex justifyContent="space-between" alignItems="center" mb={5} flexDirection={{ base: "column", md: "row" }}>
             <Text fontSize={"15px"} fontWeight={"600"}>Logo</Text>
                <IconButton
                    icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    isRound
                    size="lg"
                    onClick={toggleColorMode}
                    aria-label="Toggle color mode"
                    mb={{ base: 4, md: 0 }}
                />
            </Flex>
            <Flex mb={5} justifyContent="space-between" alignItems="center" flexDirection={{ base: "column", md: "row" }}>
                <Input
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    width={{ base: "100%", md: "300px" }}
                    mb={{ base: 4, md: 0 }}
                />
                <Select value={sortOrder} onChange={handleSortOrderChange} width="150px">
                    <option value="asc">Sort by Title (A-Z)</option>
                    <option value="desc">Sort by Title (Z-A)</option>
                </Select>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={"40px"}>
                {loading ? "Loading..." : currentItems.map((el, index) => (
                    <Box
                        key={el.id}
                        p={10}
                        textAlign={"center"}
                        boxShadow={
                            "rgba(0, 0, 0, 0.1) 0px 1px 3px, rgba(0, 0, 0, 0.2) 0px 2px 6px"
                        }
                        bgGradient={gradients[index % gradients.length]}
                        color="white"
                    >
                        <Heading p={5} size="md">{el.title}</Heading>
                        <Text>{el.body}</Text>
                    </Box>
                ))}
            </SimpleGrid>
            <Flex justifyContent="center" mt={10}>
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Text mx={3} mt={1}>
                    Page {currentPage} of {totalPages}
                </Text>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </Flex>

            <AlertDialog
                isOpen={isModalOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsModalOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            End of Pages
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            No more pages. Thank you for visiting.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsModalOpen(false)}>
                                Close
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};
