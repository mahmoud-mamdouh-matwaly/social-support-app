import { describe, expect, it } from "vitest";
import {
  arabicContextLabels,
  englishContextLabels,
  translateEmploymentStatus,
  translateHousingStatus,
  translateMaritalStatus,
} from "../translations";

describe("Translation Functions", () => {
  describe("translateMaritalStatus", () => {
    it("translates marital status values to Arabic", () => {
      expect(translateMaritalStatus("single")).toBe("أعزب");
      expect(translateMaritalStatus("married")).toBe("متزوج");
      expect(translateMaritalStatus("divorced")).toBe("مطلق");
      expect(translateMaritalStatus("widowed")).toBe("أرمل");
    });

    it("returns original value for unknown status", () => {
      expect(translateMaritalStatus("unknown")).toBe("unknown");
      expect(translateMaritalStatus("")).toBe("");
    });
  });

  describe("translateEmploymentStatus", () => {
    it("translates employment status values to Arabic", () => {
      expect(translateEmploymentStatus("employed")).toBe("موظف");
      expect(translateEmploymentStatus("unemployed")).toBe("عاطل عن العمل");
      expect(translateEmploymentStatus("self-employed")).toBe("يعمل لحسابه الخاص");
      expect(translateEmploymentStatus("student")).toBe("طالب");
      expect(translateEmploymentStatus("retired")).toBe("متقاعد");
    });

    it("returns original value for unknown status", () => {
      expect(translateEmploymentStatus("unknown")).toBe("unknown");
      expect(translateEmploymentStatus("")).toBe("");
    });
  });

  describe("translateHousingStatus", () => {
    it("translates housing status values to Arabic", () => {
      expect(translateHousingStatus("own")).toBe("ملك");
      expect(translateHousingStatus("rent")).toBe("إيجار");
      expect(translateHousingStatus("family")).toBe("مع العائلة");
      expect(translateHousingStatus("other")).toBe("أخرى");
    });

    it("returns original value for unknown status", () => {
      expect(translateHousingStatus("unknown")).toBe("unknown");
      expect(translateHousingStatus("")).toBe("");
    });
  });

  describe("Context Labels", () => {
    it("provides Arabic context labels", () => {
      expect(arabicContextLabels.currentText).toBe("النص الحالي");
      expect(arabicContextLabels.maritalStatus).toBe("الحالة الاجتماعية");
      expect(arabicContextLabels.dependents).toBe("عدد المعالين");
      expect(arabicContextLabels.employmentStatus).toBe("حالة العمل");
      expect(arabicContextLabels.monthlyIncome).toBe("الدخل الشهري");
      expect(arabicContextLabels.housingStatus).toBe("وضع السكن");
      expect(arabicContextLabels.location).toBe("الموقع");
      expect(arabicContextLabels.additionalInfo).toBe("معلومات إضافية");
      expect(arabicContextLabels.currency).toBe("درهم");
    });

    it("provides English context labels", () => {
      expect(englishContextLabels.currentText).toBe("Current text");
      expect(englishContextLabels.maritalStatus).toBe("Marital status");
      expect(englishContextLabels.dependents).toBe("Number of dependents");
      expect(englishContextLabels.employmentStatus).toBe("Employment status");
      expect(englishContextLabels.monthlyIncome).toBe("Monthly income");
      expect(englishContextLabels.housingStatus).toBe("Housing situation");
      expect(englishContextLabels.location).toBe("Location");
      expect(englishContextLabels.additionalInfo).toBe("Additional context");
      expect(englishContextLabels.currency).toBe("AED");
    });
  });
});
