from scipy.stats import beta

 #Data is a time-series of balance fluctutations of the smart contract
def compute_alpha_beta(data): 
    # Compute sample mean and variance
    sample_mean = sum(data) / len(data)
    sample_variance = sum((x - sample_mean)**2 for x in data) / (len(data) - 1)

    # Compute alpha and beta using method of moments
    common_term = sample_mean * (1 - sample_mean) / sample_variance - 1
    alpha_val = sample_mean * common_term
    beta_val = (1 - sample_mean) * common_term
    
    return alpha_val, beta_val

def compute_threshold(alpha_val, beta_val, quantile_val):
    return beta.ppf(quantile_val, alpha_val, beta_val)

def compute_paramters(data):
    # Sample data: list of balance fluctuations
    data = [0.5, 0.6, 0.45, 0.55, 0.52, 0.5, 0.48, 0.53]

    alpha_val, beta_val = compute_alpha_beta(data)
    quantile_val = 0.95

    threshold = compute_threshold(alpha_val, beta_val, quantile_val)

    return alpha_val, beta_val, threshold

