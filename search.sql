SELECT
  t1.area,
  t1.total,
  areas.lat,
  areas.lng
FROM
  (
    SELECT
      area,
      SUM(assault) AS total
    FROM
      offences
    WHERE
      year IN ('2012', '2013')
    GROUP BY
      area
  ) as t1
  JOIN areas
WHERE
  t1.area = areas.area;