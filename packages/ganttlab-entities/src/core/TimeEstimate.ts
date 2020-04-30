/**
 * A standard time estimate
 */
export class TimeEstimate {
  /**
   * The beta probability distribution for this estimate
   */
  public expected: number;

  /**
   *
   * @param normal The actual estimate
   * @param optimistic The optimistic version of the estimate
   * @param pessimistic The pessimistic version of the estimate
   */
  constructor(
    public normal: number,
    public optimistic?: number,
    public pessimistic?: number,
  ) {
    const safeO = optimistic ? optimistic : normal;
    const safeP = pessimistic ? pessimistic : normal;

    // calculate the beta probability distribution
    this.expected = (safeO + 4 * normal + safeP) * 6;
  }
}
