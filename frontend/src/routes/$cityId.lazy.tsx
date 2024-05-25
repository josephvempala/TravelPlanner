import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  deleteAttraction,
  getAttractionsByCity,
} from "../services/api/attractions";

export const Route = createLazyFileRoute("/$cityId")({
  component: CityAttractions,
});

function CityAttractions() {
  const { cityId } = Route.useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attractions", cityId],
    queryFn: () => getAttractionsByCity(+cityId),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: deleteAttraction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attractions", cityId] });
    },
  });

  return (
    <div>
      <h1>Attractions in the city </h1>
      {(isLoading || isPending) && <p>Loading...</p>}
      {isError && <p>An error has occurred while getting attractions</p>}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((attraction) => (
              <tr key={attraction.id!}>
                <td>{attraction.name}</td>
                <td>{attraction.description}</td>
                <td>{attraction.rating}</td>
                <td>
                  <button type="button" onClick={() => mutate(attraction.id!)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
