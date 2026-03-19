declare namespace google.maps.places {
  interface PlacePrediction {
    placeId: string;
    text: { toString(): string };
  }

  interface AutocompleteSuggestion {
    placePrediction?: PlacePrediction;
  }

  interface AutocompleteSuggestionResponse {
    suggestions: AutocompleteSuggestion[];
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace AutocompleteSuggestion {
    function fetchAutocompleteSuggestions(request: {
      input: string;
      includedRegionCodes?: string[];
    }): Promise<AutocompleteSuggestionResponse>;
  }
}

interface Window {
  google?: {
    maps?: {
      places?: {
        AutocompleteSuggestion: typeof google.maps.places.AutocompleteSuggestion;
      };
    };
  };
}
