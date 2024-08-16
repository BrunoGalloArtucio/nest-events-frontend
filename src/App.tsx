import { BrowserRouter, Route, Routes } from "react-router-dom";
import EventsListPage from "./events/EventsListPage/EventsListPage";
import EventPage from "./events/EventPage/EventPage";
import AppHeader from "./components/AppHeader/AppHeader";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/client";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReduxProvider store={store}>
                <ChakraProvider>
                    <BrowserRouter>
                        <AppHeader />
                        <Routes>
                            <Route
                                path="/events?"
                                element={<EventsListPage />}
                            />
                            <Route
                                path="/events/:eventId"
                                element={<EventPage />}
                            />
                        </Routes>
                    </BrowserRouter>
                </ChakraProvider>
            </ReduxProvider>
        </QueryClientProvider>
    );
}

export default App;
