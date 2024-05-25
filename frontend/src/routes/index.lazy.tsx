import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { generateAttractions } from "../services/api/attractions";
import { deleteCity, getAllCities } from "../services/api/cities";
import { Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const navigator = useNavigate({
    from: "/",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cities"],
    queryFn: getAllCities,
  });

  const generateAttractionsMutation = useMutation({
    mutationFn: generateAttractions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      navigator({ to: "/$cityId", params: { cityId: data.cityId } });
    },
  });

  const deleteCityMutation = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = formData.get("city") as string;
    generateAttractionsMutation.mutate(city);
  };

  return (
    <div>
      <h1>Hi there, which city would you like to visit?</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="city" placeholder="Search for a city" />
        <button type="submit">Search</button>
      </form>
      {(isLoading || generateAttractionsMutation.isPending) && (
        <p>Loading...</p>
      )}
      {isError && <p>An error has occurred while getting cities to visit</p>}
      {data && (
        <ul>
          {data.map((city) => (
            <li key={city.id}>
              <div>
                <Link to="/$cityId" params={{ cityId: city.id }}>
                  {city.name}
                </Link>
                <button onClick={() => deleteCityMutation.mutate(city.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
