
"use server";

import { analyzeEmergencyAlert, EmergencyAlertInput, EmergencyAlertOutput } from "@/ai/flows/analyze-emergency-alert";
import type { EmergencyAlert } from "./types";

export async function handleAnalyzeAlert(
  input: EmergencyAlertInput
): Promise<EmergencyAlertOutput> {
  console.log("Analyzing alert:", input);
  try {
    const output = await analyzeEmergencyAlert(input);
    if (!output) {
      throw new Error("AI model returned no output.");
    }
    console.log("Analysis result:", output);
    return output;
  } catch (error) {
    console.error("Error analyzing emergency alert:", error);
    throw new Error("Failed to analyze emergency alert.");
  }
}


export async function createEmergencyAlert(
    alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>
): Promise<EmergencyAlert> {
    const newAlert: EmergencyAlert = {
        id: `ALT${Date.now()}`, // temp unique id
        timestamp: new Date().toISOString(),
        status: "New",
        ...alertData,
    };

    console.log("Creating new alert in DB:", newAlert);
    // In a real app, this would be:
    // await addDoc(collection(db, "emergencyAlerts"), newAlert);
    
    // For now, we just return the object
    return newAlert;
}
