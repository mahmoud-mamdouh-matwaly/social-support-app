import { Route, Routes } from "react-router-dom";
import "./App.css";
import { StepperLayout } from "./components/stepper";
import { PathConstants } from "./constants/paths";
import { StepValidationProvider } from "./contexts/StepValidationContext";
import { Layout } from "./layout";
import { Home, Success } from "./pages";
import { FamilyFinancialInfo, PersonalInformation, SituationDescriptions } from "./pages/steps";

function App() {
  return (
    <Routes>
      <Route path={PathConstants.HOME} element={<Layout />}>
        <Route index element={<Home />} />

        {/* Stepper Routes */}
        <Route
          path={PathConstants.APPLY}
          element={
            <StepValidationProvider>
              <StepperLayout />
            </StepValidationProvider>
          }
        >
          <Route path={PathConstants.APPLY_STEP_1} element={<PersonalInformation />} />
          <Route path={PathConstants.APPLY_STEP_2} element={<FamilyFinancialInfo />} />
          <Route path={PathConstants.APPLY_STEP_3} element={<SituationDescriptions />} />
        </Route>
      </Route>

      {/* Success Page - Standalone */}
      <Route path={PathConstants.SUCCESS} element={<Success />} />
    </Routes>
  );
}

export default App;
